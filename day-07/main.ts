const generateDirectorySizesFromInput = (values: string[]) => {
    const currentWorkingDirectory: string[] = []
    const directorySizes = {}

    for (const output of values) {
        if (output.startsWith('$')) {
            const command = {
                program: output.split(' ')[1],
                parameter: output.split(' ')[2]
            }
            if (command.program === 'cd') {
                if (command.parameter === '..') {
                    currentWorkingDirectory.pop()
                } else {
                    currentWorkingDirectory.push(command.parameter)
                }
            }
        } else if (output.startsWith('dir')) {
            // ignore "dir", we don't need it
        } else if (output.match(/^[0-9]/)) {
            const fileSize = parseInt(output.split(' ')[0])

            for (let i = 1; i <= currentWorkingDirectory.length; i++) {
                const thisDirectory = currentWorkingDirectory.slice(0, i).join('/')

                if (thisDirectory in directorySizes) {
                    directorySizes[thisDirectory] += fileSize
                } else {
                    directorySizes[thisDirectory] = fileSize
                }
            }
        } else {
            throw new Error(output)
        }
    }

    return directorySizes
}

export const partOne = (values: string[]) => {
    const directorySizes = generateDirectorySizesFromInput(values)

    const directoriesUnder100000 = Object.keys(directorySizes)
        .filter(dir => directorySizes[dir] <= 100000)
        .map(dir => directorySizes[dir])
        .reduce((sum, elem) => sum + elem, 0)

    return directoriesUnder100000
}

export const partTwo = (values: string[]) => {
    const totalDiskSpace = 70000000
    const updateRequires = 30000000
    const directorySizes: object = generateDirectorySizesFromInput(values)
    const freeSpaceOnRoot = totalDiskSpace - directorySizes['/']
    const needToFree = updateRequires - freeSpaceOnRoot

    const directoryToRemove: number[] = Object.values(directorySizes)
        .filter(size => size >= needToFree)
        .sort((a, b) => a - b)
        .slice(0, 1)

    return directoryToRemove[0]
}
