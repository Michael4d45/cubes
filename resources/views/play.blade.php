<x-app-layout>
    <canvas id='c'></canvas>
    
    @push('scripts')
        <script src="{{ mix('js/cubes.js') }}"></script>
    @endpush
</x-app-layout>
