export default {
    'end-game': {
        image:
            'https://images.unsplash.com/photo-1497039465987-61d305728610?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
        title: 'The World Has Ended.',
        distance: '100 miles away',
        text:
            'Please find a new planet to destroy, if you want to proceed. And do not try to swipe. Please.',
        weight: 1000,
        actions: {
            left: {
                modifier: {
                    type: 'replace',
                    state: {
                        environment: 10,
                        people: 10,
                        security: 10,
                    },
                    flags: {},
                },
                nextEventCardId: null,
            },
            right: {
                modifier: {
                    type: 'replace',
                    state: {
                        environment: 10,
                        people: 10,
                        security: 10,
                    },
                    flags: {},
                },
                nextEventCardId: null,
            },
        },
    },
}
