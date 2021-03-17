<x-app-layout>
    <div id='menu' class='absolute w-full p-10 text-center'>
        <button class='p-3 text-4xl uppercase bg-yellow-300 rounded' id='play'>Play!</button>
    </div>
    <canvas id='c' class='w-full'></canvas>
    
    @push('scripts')
        <script src="{{ mix('js/cubes.js') }}"></script>
    @endpush
</x-app-layout>
