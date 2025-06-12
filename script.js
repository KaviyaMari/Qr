let personCount = 0;

function addPerson() {
  const container = document.getElementById('form-container');
  const formDiv = document.createElement('div');
  formDiv.className = 'person-form';
  formDiv.id = `person-${personCount}`;

  formDiv.innerHTML = `
    <input type="text" placeholder="Certificate ID" class="cert_id"><br>
    <input type="text" placeholder="Name" class="name"><br>
    <input type="text" placeholder="College" class="college"><br>
    <input type="text" placeholder="Domain" class="domain"><br>
    <input type="text" placeholder="Project" class="project"><br>
    <input type="text" value="VIPS.Tech" class="company" readonly><br>
    <label>Start Date:</label>
    <input type="date" class="start_date"><br>
    <label>End Date:</label>
    <input type="date" class="end_date"><br>
  `;

  container.appendChild(formDiv);
  personCount++;
}

function formatDate(inputDate) {
  const date = new Date(inputDate);
  if (isNaN(date)) return ''; // Handle invalid date
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

function generateQRs() {
  const qrContainer = document.getElementById('qr-container');
  qrContainer.innerHTML = ''; // Clear old QRs

  for (let i = 0; i < personCount; i++) {
    const form = document.getElementById(`person-${i}`);
    if (!form) continue;

    const cert_id = form.querySelector('.cert_id').value;
    const name = form.querySelector('.name').value;
    const college = form.querySelector('.college').value;
    const domain = form.querySelector('.domain').value;
    const project = form.querySelector('.project').value;
    const company = form.querySelector('.company').value;
    const startDateRaw = form.querySelector('.start_date').value;
    const endDateRaw = form.querySelector('.end_date').value;
    const startDate = formatDate(startDateRaw);
    const endDate = formatDate(endDateRaw);
    const duration = `${startDate} to ${endDate}`;

    const dataString = 
    `Certificate ID: ${cert_id}\n` +
    `Name: ${name}\n` +
    `College: ${college}\n` +
    `Domain: ${domain}\n` +
    `Project: ${project}\n` +
    `Company: ${company}\n` +
    `Duration: ${duration}`;

    const qrDiv = document.createElement('div');
    qrDiv.className = 'qr-block';

    const label = document.createElement('p');
    label.textContent = `${cert_id} - ${name}`;

    const canvas = document.createElement('canvas');
    canvas.id = `qr-${i}`;
    const qr = new QRious({
      element: canvas,
      value: dataString,
      size: 200
    });

    // Download Button
    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = "⬇ Download";
    downloadBtn.onclick = () => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL();
      link.download = `${cert_id}_${name}_QR.png`;
      link.click();
    };

    // Print Button
    const printBtn = document.createElement('button');
    printBtn.textContent = "🖨️ Print";
    printBtn.onclick = () => {
      const win = window.open('', '_blank');
      win.document.write(`
        <html>
        <head><title>Print QR</title></head>
        <body style="text-align: center; font-family: sans-serif;">
          <h2>${cert_id} - ${name}</h2>
          <img src="${canvas.toDataURL()}" />
          <br><br>
          <button onclick="window.print();">Print</button>
        </body>
        </html>
      `);
      win.document.close();
    };

    qrDiv.appendChild(label);
    qrDiv.appendChild(canvas);
    qrDiv.appendChild(downloadBtn);
    qrDiv.appendChild(printBtn);
    qrContainer.appendChild(qrDiv);
  }
}
