<script lang="ts">
    export let value: number
</script>

<div class="w-8 h-1 2xs:w-10 2xs:h-1.5 xs:w-12 xs:h-2 bg-gray-800 shadow-lg">
    <div
        class="value relative h-full transition-all bg-white duration-200"
        style:width="{value}%"
    />
</div>
