import React, { useRef, useMemo, useEffect } from "react";
import { useDropzone } from "react-dropzone";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingBottom: "50px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const Dropzone = (props) => {
  const { required, name, field } = props;

  const existingImageUrl =
    field.value && typeof field.value === "string" ? field.value : null;

  const hiddenInputRef = useRef(null);

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    open,
    acceptedFiles,
  } = useDropzone({
    onDrop: (incomingFiles) => {
      if (hiddenInputRef.current) {
        const dataTransfer = new DataTransfer();
        incomingFiles.forEach((v) => {
          dataTransfer.items.add(v);
        });
        hiddenInputRef.current.files = dataTransfer.files;
      }

      if (typeof field?.onChange === "function") {
        field.onChange(incomingFiles[0] ?? null);
      }
    },
  });

  useEffect(() => {
    if (!field?.value && hiddenInputRef.current) {
      hiddenInputRef.current.value = "";
    }
  }, [field?.value]);

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  // Only show files if field has a value (to handle reset properly)
  const showFiles = field?.value && acceptedFiles.length > 0;
  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const handleRemove = (e) => {
    e.stopPropagation();
    field.onChange(null);
  };

  return (
    <div className="">
      {existingImageUrl && !showFiles ? (
        <div {...getRootProps({ style })}>
          <p className="text-sm text-gray-500 mb-2 font-semibold">
            Current Image:
          </p>
          <div className="w-32 h-32 mb-3 border rounded overflow-hidden relative">
            <img
              src={existingImageUrl}
              alt="Current Hotel"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-0 text-red-500 hover:text-red-700 p-1"
            >
              sss
            </button>
          </div>

          <input
            type="file"
            name={name}
            onChange={(e) => field?.onChange?.(e.target.files?.[0] ?? null)}
            style={{ opacity: 0 }}
            ref={hiddenInputRef}
          />
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here</p>
          <button type="button" onClick={open}>
            Open File Dialog
          </button>
        </div>
      ) : (
        <div {...getRootProps({ style })}>
          <input
            type="file"
            name={name}
            onChange={(e) => field?.onChange?.(e.target.files?.[0] ?? null)}
            style={{ opacity: 0 }}
            ref={hiddenInputRef}
          />
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here</p>
          <button type="button" onClick={open}>
            Open File Dialog
          </button>
        </div>
      )}

      {showFiles && (
        <aside>
          <h4>Files</h4>
          <ul>{files}</ul>
        </aside>
      )}
      {field?.value && !showFiles && field.value instanceof File && (
        <aside>
          <h4>Selected File</h4>
          <ul>
            <li>
              {field.value.name} - {(field.value.size / 1024).toFixed(2)} KB
            </li>
          </ul>
        </aside>
      )}
    </div>
  );
};

export default Dropzone;
