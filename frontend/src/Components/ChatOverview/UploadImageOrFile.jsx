import { useDispatch, useSelector } from "react-redux";
import { makePostToggle } from "../../redux/navigateSlice";
import React  from 'react';
import { BiImageAdd } from "react-icons/bi";
import { BsFillFileArrowUpFill } from "react-icons/bs";
import "./uploadimageorfile.css";
const UploadImageOrFile = () => {
    const isOpenPost = useSelector((state) => state.nav.makepost.open);
    const dispatch = useDispatch();
    const handleOpenPost = () => {
        dispatch(makePostToggle(!isOpenPost));
    };
    return (
        <footer className="upload">
            <div className="upload-title" onClick={handleOpenPost}>
                <BiImageAdd/>
            </div>
            <div className="upload-title" onClick={handleOpenPost}>
                <BsFillFileArrowUpFill/>
            </div>
        </footer>
    );
};

export default UploadImageOrFile;
