import { Select } from 'antd';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';


function SearchInput(props) {
    const [data, setData] = useState([]);
    const [value, setValue] = useState();
    // let timeout;
    // let currentValue;

    // const fetch = (value, callback) => {
    //     if (timeout) {
    //         clearTimeout(timeout);
    //         timeout = null;
    //     }
    //     currentValue = value;
    //     const fake = () => {
    //         const str = qs.stringify({
    //             code: 'utf-8',
    //             q: value,
    //         });
    //         jsonp(`https://suggest.taobao.com/sug?${str}`)
    //             .then((response) => response.json())
    //             .then((d) => {
    //                 if (currentValue === value) {
    //                     const { result } = d;
    //                     const data = result.map((item) => ({
    //                         value: item[0],
    //                         text: item[0],
    //                     }));
    //                     callback(data);
    //                 }
    //             });
    //     };
    //     if (value) {
    //         timeout = setTimeout(fake, 300);
    //     } else {
    //         callback([]);
    //     }
    // };

    const supabase = createClient(
        'https://exsvuquqspmbrtyjdpyc.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4c3Z1cXVxc3BtYnJ0eWpkcHljIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODYyNzMxNDgsImV4cCI6MjAwMTg0OTE0OH0.vtMaXrTWDAluG_A-68pvQlSQ6GAskzADYfOonmCXPoo'
    );

    const searchFromSupabase = async (value, callback) => {
        console.log("value:" + value)
        // Make a query to search your Supabase table based on the provided value
        await supabase
            .from('property_post')
            .select('*')
            .ilike('propertyName', `${value}%`)
            .then(({ data, error }) => {
                if (error) {
                    console.error('Search failed:', error);
                    callback([]);
                    return;
                }

                console.log(data);
                // Format the data to match the expected structure for autocomplete options
                const formattedData = data.map((item) => ({
                    postID: item.postID,
                    propertyName: item.propertyName,
                }));
                console.log(formattedData);

                // Call the callback function with the formatted data
                callback(formattedData);
            })
            .catch((error) => {
                console.error('An error occurred:', error);
                callback([]);
            });
    };

    const handleSearch = (newValue) => {
        searchFromSupabase(newValue, setData);
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
            style={{...props.style}}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={handleSearch}
            onChange={handleChange}
            notFoundContent={null}
            options={(data || []).map((d) => ({
                value: d.propertyName,
                label: d.propertyName,
            }))}
        />
    );
}

export default SearchInput;