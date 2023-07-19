import {Select} from 'antd'
import {useState} from 'react'

function StateSelection({value, onChange, className, ...rest}){

    const stateOption = [
        {
            value: 'Johor',
            label: 'Johor'
        },
        {
            value: 'Kedah',
            label: 'Kedah'
        },
        {
            value: 'Kelantan',
            label: 'Kelantan'
        },
       
        {
            value: 'Malacca',
            label: 'Malacca'
        },
        {
            value: 'Negeri Sembilan',
            label: 'Negeri Sembilan'
        },
        {
            value: 'Pahang',
            label: 'Pahang'
        },
        {
            value: 'Penang',
            label: 'Penang'
        },
        {
            value: 'Perak',
            label: 'Perak'
        },
        {
            value: 'Perlis',
            label: 'Perlis'
        },
       
        {
            value: 'Sabah',
            label: 'Sabah'
        },
        {
            value: 'Sarawak',
            label: 'Sarawak'
        },
        {
            value: 'Selangor',
            label: 'Selangor'
        },
        {
            value: 'Terengganu',
            label: 'Terengganu'
        },
        
        {
            value: 'Wilayah Persekutuan Kuala Lumpur',
            label: 'Wilayah Persekutuan Kuala Lumpur'
        },
        {
            value: 'Wilayah Persekutuan Labuan',
            label: 'Wilayah Persekutuan Labuan'
        },
        {
            value: 'Wilayah Persekutuan Putrajaya',
            label: 'Wilayah Persekutuan Putrajaya'
        },
    ];

    const [state, setState] = useState(undefined);

    const handleChange = (e) => {
        onChange(e); //send back to parent
        setState(e);
    }

    return <Select className={className} placeholder="All States" options={stateOption} onChange={handleChange} value={state} style={rest.style}/>

}

export default StateSelection;