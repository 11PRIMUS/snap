import React, {useState, useRef} from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';

function UploadImage(){
    const [file, setFile] = useState(null);
    const [polaroidUrl, setPolariodUrl] = useState('');
    const polaroidRef = serRef(null);

    const handleUpload =async () =>{
        const formData = new FormData();
        formData.append('file',file);

        const {data} =await axios.post('/upload', formData);
        generatePolariod(data.image_url);
    };
    const generatePolariod=(imageUrl) =>{
        html2canvas(polaroidRef.current).then(Canvas =>{
            setPolariodUrl(Canvas.toDataUrl('image/png'));
        });

    };

    return (
        <div>
            <input type="file" onChange={e => setFile(e.target.files[0])}/>
            <button onClick ={handleUpload}>Create Polariod</button>

            <div ref={polaroidRef} className="polariod">
                {file && <img src={URL.createObjectURL(file)} alt="Preview" />}
                <div className ="caption"> your memory</div>
        
            </div>

            {polaroidUrl && (
                <>
                    <button onClick={()=> downloadImage(polaroidUrl)}>Download</button>
                    <button onClick={() => NavigationHistoryEntry('checkout')}> Orger Now </button>
                </>
            )}
        </div>
    );
}
