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
                {setup.data.length === 0 ? (
                    <tr>
                        <td colSpan={setup.headers.length} className={styles["text-center"]}>No data available</td>
                    </tr>
                ) : (
                    setup.data.map((row, rowIndex) => (
                        <tr key={rowIndex} className={setup.clickable ? styles["clickable"] : ""} onClick={() => setup.onClick(Number(row[0]))}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex}>{cell}</td>
                            ))}
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
}