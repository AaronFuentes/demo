import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const createEvidencePDF = evidence => {
    let container = document.createElement('div');

    container.innerHTML = `
        <div id="pdfcontainer" style="font-family: 'Lato'; width: 17cm; padding: 0.4em">
            <div style="padding: 1em;">
                <div style="display: flex; justify-content: space-between; border: 1px solid gainsboro;">
                    <div>
                        Hash del evento:
                    </div>
                    <div>
                        <a href="www.google.es">2393402394823094283409</a>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('root').appendChild(container);

    let data;

    html2canvas(document.querySelector("#pdfcontainer")).then(canvas => {
        data = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(data, 'PNG', 0, 0);
        pdf.save("download.pdf");
    });


}