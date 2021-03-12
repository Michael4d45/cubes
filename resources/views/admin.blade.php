<x-app-layout>
    <x-slot name="header">
        <h2 class="text-xl font-semibold leading-tight text-gray-800">
            {{ __('Settings') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
            @foreach (\App\Models\Setting::ROWS as $row)
                @if (\App\Models\Setting::getCast($row) != 'none')
                    <div x-data={show:{{ $page == $row ? 'true' : 'false' }}}>
                        <div @click="show=!show">
                            <x-jet-label for='{{ $row }}' class='mb-4 cursor-pointer'>
                                {{ ucwords(str_replace('_', ' ', $row)) }}</x-jet-label>
                        </div>
                        <div x-show="show">
                            <x-form :action='route("settings", $row)' class='w-full' method="PUT">
                                <div class='m-2'>
                                    <div class=''>
                                        @switch(\App\Models\Setting::getCast($row))
                                            @case('date')
                                            @break
                                            @case('number')
                                            @break
                                            @case('boolean')
                                            Yes:
                                            <br>
                                            No:
                                            @break
                                            @default
                                            <x-jet-input id='{{ $row }}' name='{{ $row }}' type='text'
                                                value="{{ \App\Models\Setting::$row() }}" />
                                        @endswitch
                                    </div>
                                    <div class=''>
                                        <x-jet-button class='mt-3'>Update</x-jet-button>
                                    </div>
                                </div>
                            </x-form>
                        </div>
                    </div>
                    <hr class='mt-2 mb-2'>
                @endif
            @endforeach
        </div>
    </div>
</x-app-layout>
