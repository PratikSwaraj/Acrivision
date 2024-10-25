import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import "./styles.css";
import { Line, OrbitControls } from "@react-three/drei";
import * as XLSX from "xlsx";
import sampleXlsx from "./data/sample.xlsx";

function App() {
  const [data, setData] = useState({});

  useEffect(() => {
    const excelData = async () => {
      try {
        const response = await fetch(sampleXlsx);
        if (!response.ok) throw new Error("Network response was not ok");
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        const allSheet = {};
        workbook.SheetNames.forEach((sheetName) => {
          const sheetData = workbook.Sheets[sheetName];

          const jsonData = XLSX.utils.sheet_to_json(sheetData);

          allSheet[sheetName] = jsonData;
        });

        setData(allSheet);
      } catch (error) {
        console, log(error);
      }
    };

    excelData();
  }, []);

  if (!data.A) {
    return <p></p>;
  }
  let members = data.A;
  let nodes = data.B;

  return (
    <Canvas camera={{ position: [60, 50, 90], fov: 105 }}>
      <ambientLight />
      <OrbitControls />
      <group position={[0, 0, 0]}>
        {members.map((member, index) => {
          let startNode = nodes[member["Start Node"] - 1];
          let endNode = nodes[member["End Node"] - 1];

          const points = [
            [startNode["X"], startNode["Y"], startNode["Z"]],
            [endNode["X"], endNode["Y"], endNode["Z"]],
          ];
          return (
            <Line key={index} points={points} color="black" lineWidth={2} />
          );
        })}
      </group>
    </Canvas>
  );
}

export default App;
