export const fetchReleaseTag = () => {
    const isZh = window.location.href.includes('/zh/')
    const baseUrl = isZh 
        ? 'https://image.cnxct.com/repos/gojue/ecapture/releases'
        : 'https://api.github.com/repos/gojue/ecapture/releases'

    return fetch(baseUrl)
        .then((res) => res.json())
        .then((releases) => {
            if (!releases || !Array.isArray(releases) || releases.length === 0) return

            // Only process the first 5 releases
            const latestReleases = releases.slice(0, 5)

            // Get the latest release tag for the download button
            const latestTag = latestReleases[0].tag_name ?? ''
            if (!latestTag) return

            const tagLineParagraph = document.querySelector('#github_download')
            if (!tagLineParagraph) return

            // Find the button-content span
            const buttonContent = tagLineParagraph.querySelector('.button-content')
            if (!buttonContent) return

            const docsReleaseTagSpan = document.createElement('samp')
            docsReleaseTagSpan.classList.add('docs-github-release-tag')
            docsReleaseTagSpan.innerText = latestTag
            buttonContent.appendChild(docsReleaseTagSpan)
        })
        .catch(error => {
            console.error('Failed to fetch releases:', error)
        })
}

