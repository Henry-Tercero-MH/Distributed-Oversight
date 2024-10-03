import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Para tablas (opcional, si deseas organizar mejor los datos)

const BotonGenerarPDF = ({ datosAEnviar }) => {
  const generarPDF = () => {
    const doc = new jsPDF();

    // Agregar título al PDF
    doc.text("Datos del Vehículo y Conductor", 10, 10);

    // Inicializar la posición vertical para el texto
    let y = 20; // posición inicial

    // Iterar sobre los datos a enviar y agregarlos al PDF
    Object.entries(datosAEnviar).forEach(([key, value]) => {
      if (typeof value === "string" && value.startsWith("data:image/")) {
        // Si el valor es una imagen base64, agregarla al PDF
        doc.addImage(value, "PNG", 10, y, 40, 30); // Ajusta la posición y tamaño según sea necesario
        y += 35; // Incrementar posición para la siguiente línea
      } else {
        doc.text(
          `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`,
          10,
          y
        );
        y += 10; // Incrementar la posición para la siguiente línea
      }
    });

    // Guardar el PDF
    doc.save("datos_vehiculo.pdf");
  };

  return <button onClick={generarPDF}>Generar PDF</button>;
};

export default BotonGenerarPDF;
