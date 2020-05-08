module.exports = {
    prefix: '*',
    logging:{
        modlog:{
            enabled: false,
            channel: null,
            type: 'embed'
        },
        nicklog:{
            enabled: false,
            channel: null,
            type: 'embed'
        },
        rolelog:{
            enabled: false,
            channel: null,
            type: 'embed'
        },
        serverlog:{
            enabled: false,
            channel: null,
            type: 'embed'
        },
        imagelog:{
            enabled: false,
            channel: null,
            type: 'embed'
        },
        usernameLog:{
            enabled: false,
            channel: null,
            type: 'embed'
        },
        msglog:{
            enabled: false,
            channel: null,
            type: 'embed'
        }
    },
    roles:{
        muted: null,
        moderator: null,
        administrator: null
    },
    disabledCommands: [],
    ignored:{
        users: [],
        channels: [],
        roles: []
    },
    greeting:{
        type: 'embed',
        text: null,
        enabled: false,
        channel: null
    },
    goodbye:{
        type: 'embed',
        text: null,
        enabled: false,
        channel: null
    },
    autoResponses: [],
    dmOnModeration:{
        warn: false,
        mute: false,
        unmute: false,
        kick: true,
        ban: true,
        unban: false,
        roleChange: false,
        caseResolve: false
    }
};