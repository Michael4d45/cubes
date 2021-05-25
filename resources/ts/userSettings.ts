interface Settings {
    backgroundColor: string,
}

const settings: Settings = (window as any).settings;

const backgroundColor = parseInt(settings.backgroundColor);

export { backgroundColor }