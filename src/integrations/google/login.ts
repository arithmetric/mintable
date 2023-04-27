import { getConfig } from '../../common/config'
import prompts from 'prompts'
import open from 'open'
import { GoogleIntegration } from './googleIntegration'
import { logInfo, logError } from '../../common/logging'

export default async () => {
    return new Promise<void>(async (resolve, reject) => {
        try {
            console.log(
                '\nThis script will update your Google authentication.'
            )

            const google = new GoogleIntegration(getConfig())
            open(google.getAuthURL())

            console.log('\n\t1. A link will open in your browser asking you to sign in')
            console.log('\t2. Sign in with the account you want to use with Mintable')
            console.log(
                "\t3. If you see a page saying 'This app isn't verified', click 'Advanced' and then 'Go to app (unsafe)'"
            )
            console.log("\t4. Click 'Allow' on both of the next two screens")
            console.log('\t5. Copy & paste the code from your browser below:\n')

            const authentication = await prompts([
                {
                    type: 'password',
                    name: 'code',
                    message: 'Enter the code from your browser here',
                    validate: (s: string) => (s.length >= 8 ? true : 'Must be at least 8 characters in length.')
                }
            ])

            const tokens = await google.getAccessTokens(authentication.code)
            await google.saveAccessTokens(tokens)

            logInfo('Successfully set up Google Integration.')
            return resolve()
        } catch (e) {
            logError('Unable to set up Plaid Integration.', e)
            return reject()
        }
    })
}
