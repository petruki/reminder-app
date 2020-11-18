import { authHeader, handleResponse } from '../_helpers';
import { dev } from '../_environment';

export const reminderService = {
    count,
    findAll,
    create,
    updateById,
    deleteById
};

function count() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${dev.API_URL}/api/reminder/count`, requestOptions).then(handleResponse);
}

function findAll() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${dev.API_URL}/api/reminder`, requestOptions).then(handleResponse);
}

function create(reminder) {
    const requestOptions = { 
        method: 'POST', 
        headers: authHeader(),
        body: JSON.stringify(reminder)
    };
    return fetch(`${dev.API_URL}/api/reminder/create`, requestOptions).then(handleResponse);
}

function updateById(reminder) {
    const requestOptions = { 
        method: 'PATCH', 
        headers: authHeader(),
        body: JSON.stringify({
            name: reminder.name,
            description: reminder.description,
            priority: reminder.priority,
            date: reminder.date
        })
    };
    return fetch(`${dev.API_URL}/api/reminder/${reminder._id}`, requestOptions).then(handleResponse);
}

function deleteById(id) {
    const requestOptions = { method: 'DELETE', headers: authHeader() };
    return fetch(`${dev.API_URL}/api/reminder/${id}`, requestOptions).then(handleResponse);
}