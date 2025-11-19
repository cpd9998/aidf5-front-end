import React, {
  useRef,
  useMemo,
  useEffect,
  useCallback,
  useState,
} from "react";
import { useDropzone } from "react-dropzone";
import { IoCloseSharp } from "react-icons/io5";

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

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16,
};

const thumb = {
  display: "inline-flex",
  position: "relative",
  borderRadius: 2,
  border: "1px solid #eaeaea",

  width: 100,
  height: 100,
  // padding: 4,
  boxSizing: "border-box",
};

const thumbInner = {
  display: "flex",

  minWidth: 0,
  overflow: "hidden",
};

const img = {
  display: "block",
  position: "absolute",

  width: "auto",
  height: "100%",
};

const Dropzone = (props) => {
  const { name, field, multiple = true } = props;

  console.log("field?.value", field?.value);
  const existingImageUrl =
    !multiple && field?.value && typeof field?.value === "string"
      ? field?.value
      : null;

  console.log("existingImageUrl", existingImageUrl);

  const hiddenInputRef = useRef(null);

  // Function to handle changes and pass data to RHF
  const handleChange = useCallback(
    (incomingFiles) => {
      let files;
      if (typeof field?.onChange === "function") {
        if (multiple) {
          field.onChange(
            incomingFiles.map((file) =>
              Object.assign(file, {
                preview: URL.createObjectURL(file),
              })
            ) ?? null
          );
        } else {
          field.onChange(
            Object.assign(incomingFiles[0], {
              preview: URL.createObjectURL(incomingFiles[0]),
            }) ?? null
          );
        }
      }
    },
    [field.onChange, multiple]
  );

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
      handleChange(incomingFiles);
    },
  });

  useEffect(() => {
    const valueIsMissing = multiple
      ? Array.isArray(field?.value) && field.value.length === 0
      : !field?.value;

    if (valueIsMissing && hiddenInputRef.current) {
      hiddenInputRef.current.value = "";
    }
  }, [field?.value, multiple]);

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const currentFiles = useMemo(() => {
    if (multiple) {
      return Array.isArray(field.value) ? field.value : [];
    }

    return field.value && field.value instanceof File ? [field.value] : [];
  }, [field.value, multiple]);

  const displayFiles = currentFiles.length > 0 || acceptedFiles.length > 0;

  const handleRemove = (e, key) => {
    console.log(currentFiles, key);
    e.preventDefault();
    const filterdList = currentFiles
      .filter((file) => file.path !== key)
      .map((file) => {
        return Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
      });
    field.onChange(filterdList);
  };

  const fileList = currentFiles.map((file, index) => {
    const key = file.path || `${file.name}-${index}`;
    return (
      <div style={thumb} key={key}>
        <div style={thumbInner}>
          <img
            src={file.preview}
            style={img}
            // Revoke data uri after image is loaded
            onLoad={() => {
              URL.revokeObjectURL(file.preview);
            }}
          />
        </div>
        <button
          type="button"
          onClick={(e) => handleRemove(e, key)}
          className="absolute top-1 right-0 text-red-500 hover:text-red-700 p-1 text-xl"
        >
          <IoCloseSharp className="" />
        </button>
      </div>
    );
  });

  const renderFileInput = (useDropzoneInput) => {
    const defaultInput = (
      <input
        type="file"
        name={name}
        // 5. Set 'multiple' attribute on the manual input
        multiple={multiple}
        onChange={(e) => {
          const files = e.target.files ? Array.from(e.target.files) : [];
          handleChange(files);
        }}
        style={{ opacity: 0 }}
        ref={hiddenInputRef}
      />
    );
    // Use either the useDropzone's input or our hidden input
    return useDropzoneInput ? <input {...getInputProps()} /> : defaultInput;
  };

  const showExistingSingleImage = existingImageUrl && !displayFiles;

  return (
    <div className="">
      {/* Existing Image URL (Single Mode Only) */}
      {showExistingSingleImage ? (
        <div {...getRootProps({ style, onClick: (e) => e.stopPropagation() })}>
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
              className="absolute top-1 right-0 text-red-500 hover:text-red-700 p-1 text-xl"
            >
              <IoCloseSharp className="" />
            </button>
          </div>

          {renderFileInput(false)}
          <p>Click or drag a new file to replace</p>
          <button type="button" onClick={open}>
            Open File Dialog
          </button>
        </div>
      ) : (
        /* Default Dropzone Area */
        <div {...getRootProps({ style, onClick: (e) => e.stopPropagation() })}>
          {renderFileInput(false)}
          {renderFileInput(true)}
          <p>Drag 'n' drop files here</p>
          <button type="button" onClick={open}>
            Open File Dialog
          </button>
        </div>
      )}

      {displayFiles && (
        <aside className="mt-4">
          <h4>Selected File(s)</h4>
          <ul>{fileList}</ul>
        </aside>
      )}
    </div>
  );
};

export default Dropzone;
