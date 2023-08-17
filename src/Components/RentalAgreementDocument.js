import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from 'antd';

function RentalAgreementDocument({ componentToPrint }) {
    const contentRef = useRef(null);

    const exportPDF = async () => {
        const content = contentRef.current;

        // Use html2canvas to capture the content as an image with a higher resolution (scale 4)
        const canvas = await html2canvas(content, {
            scale: 4, // Adjust the scale to capture the content with higher resolution
        });

        // Convert the canvas image to a data URL
        const imgData = canvas.toDataURL("image/jpeg", 1.0);

        // Calculate the size of the PDF
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        });

        // Calculate the aspect ratio to maintain content proportions
        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = canvas.height * (imgWidth / canvas.width);

        // Add the image to the PDF
        pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);

        pdf.setFontSize(20);

        // Save the PDF
        pdf.save("rental_agreement.pdf");
    };

    return (
        <div ref={contentRef}>
            {/* Render your custom component inside the content div */}
            {componentToPrint && componentToPrint()}
            <Button onClick={exportPDF}>Generate PDF</Button>
        </div>
    );
}

export default RentalAgreementDocument;
