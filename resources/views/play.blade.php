<x-app-layout>
    <div id='menu' class='absolute w-full p-10 text-center'>
        <div class='m-2'>
            <button class='p-3 text-4xl uppercase bg-yellow-300 rounded' id='play'>Play!</button>
        </div>
        <div class='m-2'>
            <button class='hidden p-3 text-4xl uppercase bg-yellow-300 rounded none' id='VRButton'>Enter VR</button>
        </div>
    </div>
    <canvas id='c' class='w-full'></canvas>

    @push('scripts')
        <script>
            var settings = {!! json_encode($settings) !!}
        </script>
        <script src="{{ mix('js/play.js') }}"></script>
    @endpush
</x-app-layout>
