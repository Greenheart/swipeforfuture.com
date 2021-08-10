<script lang="ts">
    export let value: number
</script>

<div class="w-8 h-1 2xs:w-10 2xs:h-1.5 xs:w-12 xs:h-2 bg-gray-800 shadow-lg">
    <div class="relative h-full bg-white" style="width: {value}%" />
</div>
