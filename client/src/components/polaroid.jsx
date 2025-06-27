import REACT, {useState} from 'react';
import axios from 'axios';

const PolariodMaker =()=>{
    const [file, setFile]= useState(null);
    const [polariodUrl, setPolariodUrl] = useState('');

    const handleUpload = async() =>{
        const formData = new FormData();
        formData.append('file', file);

        const response= await axios.post('http://localhost:8000/upload', formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        });
    
        generatePolaroid(response.data.uuid);
  };
    const generatePolariod = (uuid) => {
        const polariodContainer= document.getElementById('polaroid-container');
        html2canvas(polariodContainer). then(canvas =>{
            const imgData = canvas.toDataURL('image/png');
            setPolariodUrl(imgData);
            axios.post('/save_polaroid', {uuid, imgData});
        });
    };

    const downloadPolaroid=()=>{
        const link = document.createElement('a');
        link.href = polariodUrl;
        link.download = 'polaroid.png';
        link.click();

    };
    return (
        <div>
            <input type="file" onChange={e=> setFile(e.target.files[0])}/>
            <button onClick={handleUpload}>Create Polaroid</button>
            
            <div id="polaroid-container" className="polaroid-style">
                {file && <img src={URL.createObjectURL(file)} alt="Preview" />}
                <div className="caption">Your Memory</div>
            </div>

            {polariodUrl && (
                <>
                <button onClick={downloadPolaroid}>download</button>
                <button onClick={() => Window.LOCATION.HREF='/checkout'}>Order Now</button>
                </>
            )}
        </div>
    );
    
};