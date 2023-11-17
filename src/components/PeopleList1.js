import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';



function PeopleList1() {

    const [people, setPeople] = useState([]);
    const [sortCriteria, setSortCriteria] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [userName, setUserName] = useState('');
    const [filteredByName, setFilteredByName] = useState([]);


    useEffect(() => {
        const fetchPeople = async () => {
            try {
                const response = await fetch(`https://swapi.dev/api/people/`);
                const data = await response.json();

                const updatedPeople = await Promise.all(
                    data.results.map(async (person) => {
                        const planetResponse = await fetch(person.homeworld);
                        const planetData = await planetResponse.json();

                        const mass = parseFloat(person.mass);
                        const height = parseFloat(person.height);
                        const planetName = planetData.name;

                        return { ...person, mass, height, planetName, homeworld: planetData };
                    })
                );

                setPeople(updatedPeople);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        console.log(people)
        fetchPeople();
    }, []);


    useEffect(() => {
        searchByName(userName);
    }, [userName, people]);

    function searchByName(userName) {
        if (userName === '') {
            setFilteredByName(people);
        } else {
            const filteredData = people.filter((item) =>
                item.name.toLowerCase().includes(userName.toLowerCase())
            );
            setFilteredByName(filteredData);
        }
    }


    const handleSort = (criteria) => {
        if (criteria === sortCriteria) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortCriteria(criteria);
            setSortOrder('asc');
        }
    };


    const parseValue = (value) => {
        if (typeof value === 'number') {
            return value;
        } else if (typeof value === 'string') {
            const dateValue = Date.parse(value);
            if (!isNaN(dateValue)) {
                return new Date(dateValue);
            } else {
                return value.toLowerCase();
            }
        } else {
            return value;
        }
    };

    const sortedPeople = [...filteredByName].sort((a, b) => {
        const valueA = parseValue(a[sortCriteria]);
        const valueB = parseValue(b[sortCriteria]);

        if (typeof valueA === 'number' && typeof valueB === 'number') {
            return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
        } else if (valueA instanceof Date && valueB instanceof Date) {
            return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
        } else {
            const stringA = String(valueA).toLowerCase();
            const stringB = String(valueB).toLowerCase();

            if (stringA < stringB) {
                return sortOrder === 'asc' ? -1 : 1;
            }
            if (stringA > stringB) {
                return sortOrder === 'asc' ? 1 : -1;
            }
            return 0;
        }
    });

    return (
            <div className='table-wrapper'>
                <input
                    type="text"
                    value={userName}
                    placeholder='Search for user...'
                    onChange={(e) => {
                        setUserName(e.target.value);
                    }}>
                </input>
                <table>
                    <thead>
                        <tr></tr>
                        <tr>
                            <th onClick={() => handleSort('name')}><div class="d-inline-flex">Name <i class="bi bi-arrow-down-circle ms-2"></i></div></th>
                            <th onClick={() => handleSort('height')}><div class="d-inline-flex">Height <i class="bi bi-arrow-down-circle ms-2"></i></div></th>
                            <th onClick={() => handleSort('mass')}><div class="d-inline-flex">Mass <i class="bi bi-arrow-down-circle ms-2"></i></div></th>
                            <th onClick={() => handleSort('created')}><div class="d-inline-flex">Created <i class="bi bi-arrow-down-circle ms-2"></i></div></th>
                            <th onClick={() => handleSort('edited')}><div class="d-inline-flex">Edited <i class="bi bi-arrow-down-circle ms-2"></i></div></th>
                            <th onClick={() => handleSort('planetName')}><div class="d-inline-flex">Planet<i class="bi bi-arrow-down-circle ms-2"></i></div></th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedPeople.map((person, index) => (
                            <tr key={index}>
                                <td>{person.name}</td>
                                <td>{person.height}</td>
                                <td>{person.mass}</td>
                                <td>{person.created}</td>
                                <td>{person.edited}</td>
                                <td><DropdownButton id="dropdown-basic-button" title={person.planetName}>
                                    <Dropdown.Item>Name: {person.homeworld.name}</Dropdown.Item>
                                    <Dropdown.Item>Diameter: {person.homeworld.diameter}</Dropdown.Item>
                                    <Dropdown.Item>Climate: {person.homeworld.climate}</Dropdown.Item>
                                    <Dropdown.Item>Population: {person.homeworld.population}</Dropdown.Item>
                                </DropdownButton></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
    );
}

export default PeopleList1;