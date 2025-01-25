
import React, { useContext } from 'react'
import  {CaptainContextData} from '../context/CaptainContext'

const CaptainDetails = () => {

    const { captain } = useContext(CaptainContextData)

    return (
        <div>
            <div className='flex flex-col items-center justify-center'>
                    <img className='h-20 w-20 rounded-full object-cover mr-2' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s" alt="" />
                    <h4 className='text-xl font-medium capitalize'>{captain.name.toUpperCase()}
                    </h4>  
                    <i className=' text-center mt-12 bg-yellow-500 rounded-full'>"Even when you're waiting, the journey has already begun."</i>    
            </div>
        </div>
    )
}

export default CaptainDetails