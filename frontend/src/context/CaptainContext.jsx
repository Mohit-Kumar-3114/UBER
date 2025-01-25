import { createContext, useState, useContext } from 'react';

export const CaptainContextData = createContext();

const CaptainContext = ({ children }) => {
    const [ captain, setCaptain ] = useState({
        name:'',
        email:''
    });
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    const updateCaptain = (captainData) => {
        setCaptain(captainData);
    };


    return (
        <CaptainContextData.Provider value={ {
            captain,
            setCaptain,
            isLoading,
            setIsLoading,
            error,
            setError,
            updateCaptain
        }}>
            {children}
        </CaptainContextData.Provider>
    );
};

export default CaptainContext;