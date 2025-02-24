class Version {
    static getMajor() { return 1; }
    static getMinor() { return 0; }
    static getPatch() { return 0; }
    static getModifier() { return "stable"; }
    static getVersion() {
        return `${Version.getMajor()}.${Version.getMinor()}.${Version.getPatch()}-${Version.getModifier}`;
    }
}

export default Version;