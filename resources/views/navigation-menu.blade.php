<nav class="w-full bg-none">
    <!-- Primary Navigation Menu -->
    <div class='py-10 mx-auto sm:px-6 lg:px-8'>
        <div class="flex justify-between h-16">
            <div class="flex">
                <!-- Logo -->
                <div class="flex items-center flex-shrink-0">
                    <a href="{{ route('home') }}">
                        <x-jet-application-mark class="block w-auto h-24 mt-5 ml-5 sm:ml-10" />
                    </a>
                </div>
            </div>
            <div class='flex-grow'></div>
            <div>
                <div class="pt-2 pb-3 space-y-1">
                    @auth
                        @if (auth()->user()->isAdmin())
                            <x-nav-link href="{{ route('admin') }}">
                                {{ __('Settings') }}
                            </x-nav-link>
                            <x-nav-link href="{{ route('profile.show') }}">
                                {{ __('Profile') }}
                            </x-nav-link>

                            <!-- Authentication -->
                            <x-form :action="route('logout')" class='inline-block'>
                                <x-nav-link href="{{ route('logout') }}" onclick="event.preventDefault();
                                                this.closest('form').submit();">
                                    {{ __('Logout') }}
                                </x-nav-link>
                            </x-form>
                        @endif
                    @else
                        <x-nav-link href="{{ route('login') }}">
                            {{ __('Log in') }}
                        </x-nav-link>
                        <x-nav-link href="{{ route('register') }}">
                            {{ __('Register') }}
                        </x-nav-link>
                    @endauth
                </div>
            </div>
        </div>
    </div>
</nav>
