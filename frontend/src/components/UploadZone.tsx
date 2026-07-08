import { useCallback, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  onFile: (file: File) => void;
  disabled?: boolean;
}

export default function UploadZone({ onFile, disabled }: Props) {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file?.name.endsWith(".zip")) {
        setFileName(file.name);
        onFile(file);
      }
    },
    [onFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFile(file);
    }
  };

  return (
    <motion.label
      htmlFor="zip-upload"
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      animate={{ borderColor: dragging ? "#58A6FF" : fileName ? "#3FB950" : "#30363D" }}
      className="flex flex-col items-center justify-center gap-3 w-full py-10 px-6 rounded-xl border-2 border-dashed cursor-pointer transition-colors"
      style={{ background: dragging ? "#58A6FF08" : "#161B22" }}
    >
      <input
        id="zip-upload"
        type="file"
        accept=".zip"
        className="sr-only"
        onChange={handleChange}
        disabled={disabled}
      />
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ background: fileName ? "#3FB95018" : "#58A6FF18", color: fileName ? "#3FB950" : "#58A6FF" }}
      >
        {fileName ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      {fileName ? (
        <div className="text-center">
          <p className="text-sm font-medium font-mono" style={{ color: "#3FB950" }}>{fileName}</p>
          <p className="text-xs mt-1" style={{ color: "#8B949E" }}>Click to replace</p>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-sm font-medium" style={{ color: "#C9D1D9" }}>
            Drop your ZIP file here
          </p>
          <p className="text-xs mt-1" style={{ color: "#8B949E" }}>
            or click to browse · .zip files only
          </p>
        </div>
      )}
    </motion.label>
  );
}
