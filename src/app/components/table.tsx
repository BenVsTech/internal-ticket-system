// Imports

import styles from "../page.module.css";
import { TableProps } from "../../types/component";

// Exports

export default function Table({ setup }: TableProps) {
    return (
        <table className={styles["table-container"]}>
            <thead>
                <tr>
                    {setup.headers.map((header) => (
                        <th key={header}>{header}</th>
                    ))}
                </tr>
            </thead>

            <tbody>
                {setup.data.map((row, rowIndex) => (
                    <tr key={rowIndex} className={setup.clickable ? styles["clickable"] : ""} onClick={() => setup.onClick(rowIndex)}>
                        {row.map((cell, cellIndex) => (
                            <td key={cellIndex}>{cell}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}