import { defaultContract } from "./defaultContract";

const button = document.getElementById("postButton") as HTMLButtonElement;
const contractText = document.getElementById("contract_text") as HTMLTextAreaElement;
const contractType = document.getElementById("contract_type") as HTMLInputElement;
const jurisdiction = document.getElementById("jurisdiction") as HTMLInputElement;
const responseEl = document.getElementById("response") as HTMLPreElement;

contractText.value = defaultContract.contract_text;
contractType.value = defaultContract.contract_type;
jurisdiction.value = defaultContract.jurisdiction;

function renderResponse(data: any) {
  if (data && (data.error || data.Error)) {
    responseEl.textContent = data.error || data.Error;
    return;
  }
  if (!data || typeof data !== 'object') {
    responseEl.textContent = JSON.stringify(data, null, 2);
    return;
  }
  let html = '';
  for (const key in data) {
    const title = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const style_start = '<section style="margin-bottom:1.5em;"><h4 style="margin-bottom:0.5em;">'
    if (Array.isArray(data[key])) {
      html += style_start + title + '</h4><ul style="margin-top:0;">';
      for (const item of data[key]) {
        html += '<li>' + item + '</li>';
      }
      html += '</ul></section>';
    } else {
      html += style_start + title + '</h4><div>' + data[key] + '</div></section>';
    }
  }
  responseEl.innerHTML = html;
}

button.addEventListener("click", async () => {
  try {
    const jsonData = {
      contract_text: contractText.value,
      contract_type: contractType.value,
      jurisdiction: jurisdiction.value
    };
    const res = await fetch('http://localhost:8000/contract_analysis', {
      method: "POST",
      headers: {"Content-Type": "application/json" },
      body: JSON.stringify(jsonData)
    });
    let data;
    if (res.status !== 200) {
      let text = await res.text();
      responseEl.textContent = `Error: ${res.status}\n${text}`;
      return;
    } else {
      data = await res.json();
    }
    renderResponse(data);
  } catch (err: any) {
    responseEl.textContent = "Error: " + err.message;
  }
});
