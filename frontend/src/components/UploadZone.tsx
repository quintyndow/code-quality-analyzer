import { useCallback, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  onFile: (file: File) => void;
  disabled?: boolean;
}

export default function UploadZone({ onFile, disabled }: Props) {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const accept = useCallback(
    (file: File) => {
      setFileName(file.name);
      onFile(file);
    },
    [onFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file?.name.endsWith(".zip")) accept(file);
    },
    [accept]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) accept(file);
  };

  return (
    <motion.label
      htmlFor="zip-upload"
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      animate={{
        borderColor: dragging ? "var(--primary)" : fileName ? "var(--success)" : "var(--border)",
        background: dragging ? "var(--primary-muted)" : "var(--surface)",
      }}
      transition={{ duration: 0.15 }}
      className="flex flex-col items-center justify-center gap-4 w-full py-12 px-6 rounded-xl border-2 border-dashed cursor-pointer"
    >
      <input
        id="zip-upload"
        type="file"
        accept=".zip"
        className="sr-only"
        onChange={handleChange}
        disabled={disabled}
      />

      <motion.div
        animate={{ scale: dragging ? 1.08 : 1 }}
        transition={{ duration: 0.15 }}
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{
          background: fileName ? "var(--success-muted)" : "var(--primary-muted)",
          color: fileName ? "var(--success)" : "var(--primary)",
        }}
      >
        {fileName ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
          </svg>
        )}
      </motion.div>

      {fileName ? (
        <div className="text-center">
          <p className="text-sm font-semibold font-mono" style={{ color: "var(--success)" }}>
            {fileName}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Click to replace file
          </p>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {dragging ? "Drop to upload" : "Drop your ZIP file here"}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            or{" "}
            <span style={{ color: "var(--primary)" }}>browse files</span>
            {" "}· .zip archives only
          </p>
        </div>
      )}
    </motion.label>
  );
}
