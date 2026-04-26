import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EspaceMedecin() {
    const token = localStorage.getItem('token');
    const navigate = useNavigate(); 
    const gm = async (token)=> {   
        try {
 const result=await axios.get('http://localhost:5000/api/medecin', {
    headers: {
        Authorization: `Bearer ${token}`,
    }
        }  );
    console.log("✅ Medecin data:", result.data);
    if (!result.data.first_login) { 

         
    navigate('/change-password');}
    }   
catch (error) {
console.error('Error fetching protected data:', error);
navigate('/'); 
}}
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        } else {
            
gm(token) ;
        }

},[navigate]);
    return (
        <div> 

            <h1>Espace Médecin</h1>
            <p>Bienvenue dans votre espace personnel, Docteur !</p>
        </div>
    );
}