
module.exports = {
    identity: 'timesheet',
    connection: 'default',
    attributes: {
        date_in: {
            type: 'datetime',
            defaultsTo: function () { return new Date(); },
            required: true,
        },
        
        date_out: {
            type: 'datetime',
            defaultsTo: function () { return new Date(); },
            required: true,
        },
        
        status: {
            type: 'string',
            enum: ['new', 'assigned', 'success', 'rejected', 'pending'],
            required: true,
        },
        location: {
            type: 'string',
            required: true,
        },
        description: {
            type: 'string',
            required: true,
        },
        user: {
            model: 'user',
        },
    }
}

