import React from 'react'

const LocationTab = ({locations,setSelectedCountry,selectedCountry}) => {
    console.log(locations)
    return (
        <div className="flex gap-3 mt-9">

            {locations.map((loc)=>(

                <div
                    key={loc._id}
                    onClick={() => setSelectedCountry(loc.name)}
                    className={` flex capitalize items-center justify-center border border-gray-300 rounded-full p-2 hover:border-gray-500 cursor-pointer transition-all duration-300 ease-in-out ${
                        selectedCountry === "all" && "bg-gray-200"
                    } `}
                >
                    {loc.name}
                </div>
            ))}
        </div>
    )
}
export default LocationTab
