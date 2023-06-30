import { Input, Select } from 'antd';
import { useState } from 'react';
import { supabase } from '../supabase-client';

function SearchInput(props) {
    const [searchOption, setSearchOption] = useState([]);
    const [value, setValue] = useState();

    const searchFromSupabase = async (value) => {
        console.log("value: " + value);
    
        const searchFields = ['propertyName', 'propertyAddress', 'propertyCity', 'propertyState'];
        const searchResults = [];
    
        for (const field of searchFields) {
            const { data, error } = await supabase
                .from('property_post')
                .select(field)
                .ilike(field, `%${value}%`);
    
            if (error) {
                console.log(error);
            }
    
            if (data && data.length > 0) {
                data.forEach((item) => {
                    if (!searchResults.some((result) => result[field] === item[field])) {
                        searchResults.push(item);
                    }
                });
            }
        }
    
        setSearchOption(searchResults);
        console.log(searchOption);
    };
    

    const options = (searchOption || []).map((d, index) => {
        const option = [];

        // Check if the option has a property name
        if (d.propertyName) {
            option.push({ value: d.propertyName, label: d.propertyName, key: `name-${index}` });
        }

        // Check if the option has a property address
        if (d.propertyAddress) {
            option.push({ value: d.propertyAddress, label: d.propertyAddress, key: `address-${index}` });
        }

        // Check if the option has a property city
        if (d.propertyCity) {
            option.push({ value: d.propertyCity, label: d.propertyCity, key: `city-${index}` });
        }

        // Check if the option has a property state
        if (d.propertyState) {
            option.push({ value: d.propertyState, label: d.propertyState, key: `state-${index}` });
        }

        return option;
    }).flat();



    const selectOptions = options || [];



    const handleSearch = (newValue) => {
        searchFromSupabase(newValue);
    };
    const handleChange = (newValue) => {
        setValue(newValue);
        props.onChange(newValue);
    };
    return (
        <Select
            showSearch
            value={value}
            placeholder={props.placeholder}
            style={{ ...props.style }}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={handleSearch}
            onChange={handleChange}
            notFoundContent={null}
            options={selectOptions}
        // options={(data || []).map((d, index) => [
        //     { value: d.propertyName, label: d.propertyName, key: `name-${index}` },
        //     { value: d.propertyAddress, label: d.propertyAddress, key: `address-${index}` },
        //     { value: d.propertyCity, label: d.propertyCity, key: `city-${index}` },
        //     { value: d.propertyState, label: d.propertyState, key: `state-${index}` }
        // ]).flat()}

        />
        // <Input />
    );
}

export default SearchInput;