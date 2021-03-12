@props(['method' => 'POST'])

@php
    $spoofMethod = in_array($method, ['PUT', 'PATCH', 'DELETE']);
@endphp

<form method="{{ $spoofMethod ? 'POST' : $method }}" {{ $attributes }}>
    @unless(in_array($method, ['HEAD', 'GET', 'OPTIONS']))
        @csrf
    @endunless
    @if ($spoofMethod)
        @method($method)
    @endif
    {{ $slot }}
</form>
