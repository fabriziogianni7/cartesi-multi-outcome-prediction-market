use json::{object, JsonValue};
use std::env;
use hex;

pub async fn handle_advance(
    client: &hyper::Client<hyper::client::HttpConnector>,
    server_addr: &str,
    request: JsonValue,
) -> Result<&'static str, Box<dyn std::error::Error>> {
    println!("Received advance request data {}", &request);
    
    // Extract the payload
    let payload_hex = request["data"]["payload"]
        .as_str()
        .ok_or("Missing payload")?;
    let payload_bytes = hex::decode(&payload_hex[2..])?; // Remove "0x" and decode hex
    let payload_str = std::str::from_utf8(&payload_bytes)?;
    let payload: JsonValue = json::parse(payload_str)?;

    println!("Parsed payload: {}", payload);

    // Check if method is "increment" and counter exists
    if payload["method"] == "increment" && payload["counter"].is_number() {
        let counter = payload["counter"].as_u64().ok_or("Invalid counter value")?;
        let new_counter = counter + 1;
        println!("Counter incremented to: {}", new_counter);

        // Encode the new counter as a hex string
        let counter_hex = format!("0x{:064x}", new_counter);

        // Create a notice
        let notice = object! { "payload" => counter_hex };
        let notice_request = hyper::Request::builder()
            .method(hyper::Method::POST)
            .uri(format!("{}/notice", server_addr))
            .header("Content-Type", "application/json")
            .body(hyper::Body::from(notice.dump()))?;

        // Send the notice
        let response = client.request(notice_request).await?;
        Ok("accept")
    } else {
        println!("Invalid method or missing counter value in payload");
        Ok("reject")
    }
}

pub async fn handle_inspect(
    _client: &hyper::Client<hyper::client::HttpConnector>,
    _server_addr: &str,
    request: JsonValue,
) -> Result<&'static str, Box<dyn std::error::Error>> {
    println!("Received inspect request data {}", &request);
    let _payload = request["data"]["payload"]
        .as_str()
        .ok_or("Missing payload")?;
    // TODO: add application logic here
    Ok("accept")
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = hyper::Client::new();
    let server_addr = env::var("ROLLUP_HTTP_SERVER_URL")?;

    let mut status = "accept";
    loop {
        println!("Sending finish");
        let response = object! {"status" => status.clone()};
        let request = hyper::Request::builder()
            .method(hyper::Method::POST)
            .header(hyper::header::CONTENT_TYPE, "application/json")
            .uri(format!("{}/finish", &server_addr))
            .body(hyper::Body::from(response.dump()))?;
        let response = client.request(request).await?;
        println!("Received finish status {}", response.status());

        if response.status() == hyper::StatusCode::ACCEPTED {
            println!("No pending rollup request, trying again");
        } else {
            let body = hyper::body::to_bytes(response).await?;
            let utf = std::str::from_utf8(&body)?;
            let req = json::parse(utf)?;

            let request_type = req["request_type"]
                .as_str()
                .ok_or("request_type is not a string")?;
            status = match request_type {
                "advance_state" => handle_advance(&client, &server_addr[..], req).await?,
                "inspect_state" => handle_inspect(&client, &server_addr[..], req).await?,
                &_ => {
                    eprintln!("Unknown request type");
                    "reject"
                }
            };
        }
    }
}
