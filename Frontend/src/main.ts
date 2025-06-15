import { defaultContract } from "./defaultContract";

const elements = {
  button: document.getElementById("postButton") as HTMLButtonElement,
  contractText: document.getElementById("contract_text") as HTMLTextAreaElement,
  contractType: document.getElementById("contract_type") as HTMLInputElement,
  jurisdiction: document.getElementById("jurisdiction") as HTMLInputElement,
  response: document.getElementById("response") as HTMLPreElement,
};

elements.contractText.value = defaultContract.contract_text;
elements.contractType.value = defaultContract.contract_type;
elements.jurisdiction.value = defaultContract.jurisdiction;

function getFormattedHtml(data: any): string {
  let html = "";

  for (const key in data) {
    const title = key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    const sectionStart = `<section style="margin-bottom:1.5em;"><h4 style="margin-bottom:0.5em;">${title}</h4>`;

    if (Array.isArray(data[key])) {
      html += `${sectionStart}<ul style="margin-top:0;">${data[key].map(item => `<li>${item}</li>`).join("")}</ul></section>`;
    } else {
      html += `${sectionStart}<div>${data[key]}</div></section>`;
    }
  }

  return html;
}

function renderResponse(data: any) {
  if (data?.error || data?.Error) {
    elements.response.textContent = data.error || data.Error;
    return;
  }

  if (!data || typeof data !== "object") {
    elements.response.textContent = JSON.stringify(data, null, 2);
    return;
  }

  elements.response.innerHTML = `<div style="max-width: 100%; overflow-x: auto; white-space: pre-wrap;">${getFormattedHtml(data)}</div>`;
}

elements.button.addEventListener("click", async () => {
  const payload = {
    contract_text: elements.contractText.value,
    contract_type: elements.contractType.value,
    jurisdiction: elements.jurisdiction.value,
  };

  try {
    const res = await fetch("http://localhost:8000/contract_analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.status !== 200) {
      const text = await res.text();
      elements.response.textContent = `Error: ${res.status}\n${text}`;
      return;
    }

    const data = await res.json();
    renderResponse(data);

  } catch (err: any) {
    elements.response.textContent = "Error: " + err.message;
  }
});
