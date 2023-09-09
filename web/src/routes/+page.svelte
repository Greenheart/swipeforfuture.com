<script lang="ts">
    import {Link} from '$components'
</script>

<div class="text-white text-center text-lg 2xs:text-xl xs:text-2xl p-4 pt-16 pb-4 xs:py-16 font-light">
    <header class="max-w-2xl mx-auto">
        <h1
            class="text-3xl 2xl:text-[40px] xs:text-5xl sm:text-6xl font-bold tracking-wide"
        >
            Swipe for Future
        </h1>
        <h2 class="mt-8 font-thin text-sm xs:text-base sm:text-lg">🌍 Solving the climate crisis, one swipe at a time 🔥</h2>
        <p class="mt-8">A community-driven game where players explore, create and share stories for a sustainable future.</p>
    </header>
    
    <div class="grid place-items-center m-auto p-16 select-none">
        <Link href="/play" class="py-4 px-16 font-black tracking-widest bg-sky-500 rounded-md hover:bg-sky-600 shadow-md">Play</Link>
    </div>

    <div class="flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
        <h2 class="text-xl 2xl:text-2xl xs:text-3xl sm:text-4xl font-bold tracking-wide ml-4">
            Join the Community
        </h2>
    </div>

    <p class="my-8">
        Welcome to co-create stories and develop the game!
    </p>

    <Link external href="https://github.com/Greenheart/swipeforfuture.com" class="no-underline text-sky-500 hover:underline">
        GitHub
    </Link>
</div>
