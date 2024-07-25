let icons: string[] = []
const modules = import.meta.glob('./../../../assets/svgs/*.svg');
for (const path in modules) {
    const p = path.split('assets/svgs/')[1].split('.svg')[0];
    icons.push(p);
}

export default icons