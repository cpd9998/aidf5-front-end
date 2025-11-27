import React, { useRef, useMemo, useEffect, useCallback } from "react";
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
  const hiddenInputRef = useRef(null);
  const handleChange = useCallback(
    (incomingFiles) => {
      let files;
      if (typeof field?.onChange === "function") {
        if (multiple) {
          const existingImageUrls = incomingFiles.filter(
            (item) => typeof item === "string"
          );
          const processedNewFiles = incomingFiles
            .filter((item) => item instanceof File)
            .map((file) =>
              Object.assign(file, {
                preview: URL.createObjectURL(file),
              })
            );

          const combinedFilesForRHF = [
            ...existingImageUrls,
            ...processedNewFiles,
          ];
          field.onChange(combinedFilesForRHF);
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
  } = useDropzone({
    onDrop: (incomingFiles) => {
      if (hiddenInputRef.current) {
        const dataTransfer = new DataTransfer();
        incomingFiles.forEach((v) => {
          dataTransfer.items.add(v);
        });
        hiddenInputRef.current.files = dataTransfer.files;
      }
      if (incomingFiles.length > 0 && multiple) {
        incomingFiles = [...field.value, ...incomingFiles];
        handleChange(incomingFiles);
      } else {
        handleChange(incomingFiles);
      }
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

    return field.value && field.value instanceof File
      ? [field.value]
      : !field.value
      ? []
      : [field.value];
  }, [field.value, multiple]);

  const displayFiles =
    multiple && currentFiles != null
      ? true
      : !multiple &&
        (currentFiles[0] instanceof File || typeof currentFiles[0] === "string")
      ? true
      : false;

  const handleRemove = (e, key) => {
    e.preventDefault();

    const filterdList = currentFiles.filter(
      (_, index) => index !== Number(key)
    );

    const list = filterdList.length > 0 ? filterdList : [];
    field.onChange(list);
  };

  const fileList = currentFiles.map((file, index) => {
    return (
      <div style={thumb} key={index}>
        <div style={thumbInner}>
          {file instanceof File ? (
            <img src={file?.preview} style={img} />
          ) : (
            <img src={file} style={img} />
          )}
        </div>
        <button
          type="button"
          onClick={(e) => handleRemove(e, index)}
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
        multiple={multiple}
        onChange={(e) => {
          const files = e.target.files ? Array.from(e.target.files) : [];
          handleChange(files);
        }}
        style={{ opacity: 0 }}
        ref={hiddenInputRef}
      />
    );

    return useDropzoneInput ? <input {...getInputProps()} /> : defaultInput;
  };

  return (
    <div className="">
      <div {...getRootProps({ style, onClick: (e) => e.stopPropagation() })}>
        {renderFileInput(false)}
        {renderFileInput(true)}
        <p>Drag 'n' drop files here</p>
        <button type="button" onClick={open}>
          Open File Dialog
        </button>
      </div>

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
