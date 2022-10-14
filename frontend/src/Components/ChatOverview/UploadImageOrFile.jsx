import React  from 'react';
import { BiImageAdd } from "react-icons/bi";
import { BsFillFileArrowUpFill } from "react-icons/bs";
import "./uploadimageorfile.css";
const UploadImageOrFile = () => {
    return (
        <footer className="upload">
            <div className="image-upload">
                <label htmlFor="file-input">
                  <BiImageAdd/>
                </label>
                <input id="file-input" type="file"/>
            </div>
            <div className="image-upload">
                <label htmlFor="file-input-folder">
                    <BsFillFileArrowUpFill/>
                </label>
                <input id="file-input-folder" type="file" />
            </div>
        </footer>
    );
};

export default UploadImageOrFile;
