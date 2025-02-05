const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

async function emit_notice(data) {
  try {
    const notice_payload = { payload: data.payload };
    const response = await fetch(rollup_server + "/notice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notice_payload),
    });

    if (response.status === 201 || response.status === 200) {
      console.log("Notice emitted successfully with data:", data);
    } else {
      console.error(`Failed to emit notice with data: ${JSON.stringify(data)}. Status code: ${response.status}`);
    }
  } catch (error) {
    console.error("Error emitting notice:", error);
  }
}

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));
  
  try {
    // Convert hex payload to string
    const payloadHex = data.payload;
    const payloadStr = Buffer.from(payloadHex.slice(2), 'hex').toString('utf8');
    const payload = JSON.parse(payloadStr);
    console.log("Payload:", payload);

    // Check if the method is increment and counter value exists
    if (payload.method === "increment" && 'counter' in payload) {
      const newCounter = payload.counter + 1;
      console.log(`Counter incremented to: ${newCounter}`);
      
      // Hex encode the counter value and pad to 32 bytes
      const counterHex = '0x' + newCounter.toString(16).padStart(64, '0');  
      await emit_notice({ payload: counterHex });
      return "accept";
      
    } else {
      console.log("Invalid method or missing counter value");
      return "reject";
    }
  } catch (error) {
    console.error("Error processing payload:", error);
    return "reject";
  }
}

var handlers = {
  advance_state: handle_advance,
};

var finish = { status: "accept" };

(async () => {
  while (true) {
    const finish_req = await fetch(rollup_server + "/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "accept" }),
    });

    console.log("Received finish status " + finish_req.status);

    if (finish_req.status == 202) {
      console.log("No pending rollup request, trying again");
    } else {
      const rollup_req = await finish_req.json();
      var handler = handlers[rollup_req["request_type"]];
      finish["status"] = await handler(rollup_req["data"]);
    }
  }
})();
