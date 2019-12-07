export default [
    {
        type: 'decision',
        image:
            'https://images.unsplash.com/photo-1561623002-b3520705eccf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
        title: 'We need power.',
        distance: '4 miles away',
        text: 'Lorem ipsum COALar sit amet consectetur, adipisicing elit.',
        actions: {
            left: {
                modifier: {
                    environment: -100,
                    people: -100,
                    security: -100,
                    money: -100
                }
            },
            right: {
                modifier: {
                    environment: 40,
                    people: 60,
                    security: 75,
                    money: 90
                }
            }
        }
    },
    {
        type: 'decision',
        image:
            'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
        title: 'Invest in solar?',
        distance: '100 miles away',
        text: 'Lorem ipsum SOLAR sit amet consectetur, adipisicing elit.',
        actions: {
            left: {
                modifier: {
                    environment: -100,
                    people: -100,
                    security: -100,
                    money: -100
                }
            },
            right: {
                modifier: {
                    environment: 40,
                    people: 60,
                    security: 75,
                    money: 90
                }
            }
        }
    },
    {
        type: 'endgame',
        image:
            'https://images.unsplash.com/photo-1497039465987-61d305728610?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
        title: 'The World Has Ended.',
        distance: '100 miles away',
        text:
            'Please find a new planet to destroy, if you want to proceed. And do not try to swipe. Please.',
        actions: {}
    }
]
