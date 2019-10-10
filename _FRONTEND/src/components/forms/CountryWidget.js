import React from "react";
import { Dropdown, Placeholder } from 'semantic-ui-react'
import { Query } from "react-apollo";
import  { COUNTRIES } from "../../functions/query"


const CountryWidget = ({value, valueSetter, disabled}) =>{
    
    const handleSubmit = (e, {value}) => valueSetter(value)
    return(
        <Query query={COUNTRIES} >
        {({loading, error, data})=>{
            if (loading) return <Placeholder><Placeholder.Line /><Placeholder.Line /></Placeholder>
            const items = data.countries
            const countries = items.map((c, i) =>  ({ key:c.country[1], value:c.country[1], text:c.country[0]  }) )
            return(
                <Dropdown placeholder='Select Country' search selection 
                    disabled={disabled}
                    onChange={handleSubmit}
                    options={countries}
                    value={value} />
            )}
        }
        </Query>

    );
}

export default CountryWidget;
