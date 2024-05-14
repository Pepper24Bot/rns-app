/**
 * This is temporary
 * 
 * Implement intl
 */

export const TWEET_RNS = `I just registered my new @RootNameService (RNS) Cross Platform, Social and Data Identity on @therootnetwork.
    %0D%0DSecure your RNS Idenity today and be eligible for @Futureverse Quest Rewards.
    %0D%0DMore info  https://futureverse.com/futurepass/quests/`

export const REGISTRATION_PROCESS = [
    {
        label: "Request to Register",
        description: "Sign transaction to start the compulsory 60 second count down to prevent others from front-running the registration by submitting a higher gas fee transaction to claim the identity first."
    },
    {
        label: "Token approval",
        description: "Once the 60 second count down has completed you will be prompted to set a spending limit and then required to sign a transaction to approve the spend of your tokens."
    },
    {
        label: "Register",
        description: "You will then be prompted to sign a transaction to cover the registration fee of your RNS identity. This is the final step in registering and securing your new RNS identity."
    },
]

export const FAQ = [
    {
        title: `Can I register an RNS with both my FuturePass address and EOA address (Ethereum address on The Root Network)?`,
        content: `Yes, but it’s important to note the following:
        
        Currently ALL gas fees are paid in $XRP from your EOA address. Even if you are connected to the RNS app with your FuturePass address, gas will be paid from your EOA address.
        

        When connected with your FuturePass address:
        
        - Gas fees are paid in XRP by the associated EOA address.
        
        - Registration fees are paid in ROOT or USDC by the connected FuturePass address.
        
        When registering via your FuturePass address there is no need to change connected wallets during the registration process, just ensure you have XRP in your EOA address for gas fees.
        
        
        When connected with your EOA address:
        
        - Gas fees are paid in XRP by the connected EOA address.
        
        - Registration fees are paid in ROOT or USDC by the connected EOA address.
        
        
        Why?
                
        To enable the FuturePass to pay for gas fees we would need to implement proxyExtrinsic and if we wanted, feeProxy (for any gas token functionality) of which both require using an extrinsic call (Substrate transaction). However, this won't emit any EVM event logs, rendering it unusable for our protocol.
        `,
        highlights: [
            {
                text: "ALL",
                isUrl: false
            },
            {
                text: "EOA address. ",
                isUrl: false
            },
            {
                text: "When connected with your FuturePass address:",
                isUrl: false
            },
            {
                text: "When connected with your EOA address:",
                isUrl: false
            },
            {
                text: "Why\\?",
                isUrl: false
            },
        ],
    },
    {
        title: `What does “Link Identity” mean?`,
        content: `Linking an RNS Identity to a wallet address simply means that you are turning your long and complex address into a human readable Identity. Therefore, this results in taking an identity such as figjam.root, and converting it to an address, such as 0x565f137127d9067788314bc7fcc1f36746a3c6Y7. This is called “forward lookup”.
        
        Figjam.root = 0x565f137127d9067788314bc7fcc1f36746a3c6Y7

        So next time you need to send someone funds, ask them for their RNS Identity.
        `,
        highlights: [
            {
                text: "forward lookup",
                isUrl: false
            },
            {
                text: "Figjam.root = 0x565f137127d9067788314bc7fcc1f36746a3c6Y7",
                isUrl: false
            },
        ],
    },
    {
        title: `What does “Set as Primary” mean?`,
        content: `Setting an RNS Identity as “Primary” means that when you visit applications and experiences that resolve RNS Identities, your chosen “Primary” RNS Identity will be displayed within those platforms instead of your long and complex wallet address. This process is called “reverse lookup”.
        
        Note: If you have set an RNS Identity as your Primary and you transfer that RNS identity to another wallet or change the wallet address it is linked to then it will no longer be displayed as your Primary.
        
        In addition, if you have an RNS Identity that is linked to another wallet address other than the one it is held in then when you “Set as Primary” the linked address will be automatically updated to the address that it is held in. 
        
        Eg.

        figjam.root held in wallet Ox23_1234
        Linked to wallet Ox23_6789
        Primary = False
        
        Then if you were to set figjam.root as Primary.
        
        New records will be:
        
        figjam.root held in wallet Ox23_1234
        Linked to wallet Ox23_1234
        Primary = True
        `,
        highlights: [
            {
                text: "reverse lookup",
                isUrl: false
            },
            {
                text: "Note:",
                isUrl: false
            },
            {
                text: "Eg.",
                isUrl: false
            },
            {
                text: "New records will be:",
                isUrl: false
            },
        ],
    },
    {
        title: `What address can I link my RNS Identity to?`,
        content: `Your RNS Identity will automatically be linked to the address in which you register your RNS Identity with. You can then amend the address the RNS Identity is linked to via “My Dashboard” by clicking the 3 dots on the tile of the RNS you want to amend, and then selecting “Link Identity”.
        
        Note: You can have multiple RNS Identities all linked to the same address. 
        `,
        highlights: [
            {
                text: "Note:",
                isUrl: false
            },
        ],
    },
    {
        title: `What happens to a linked address when an RNS Identity is transferred to a new wallet?`,
        content: `The address the RNS is linked to remains so if you have purchased an RNS from the secondary market or someone has sent you an RNS, be sure to change the linked address.`
    },
    {
        title: `Can I transfer my RNS between my FuturePass address and EOA address?`,
        content: `Yes.
        
        Note: Transferring an RNS will remove it as your Primary and the linked address will remain the same.`,
        highlights: [
            {
                text: "Note:",
                isUrl: false
            },
        ],
    },
    {
        title: `What happens to the registration period if I sell my RNS or transfer it to a new wallet?`,
        content: `The registration period carries over to the new owner/wallet. For the avoidance of doubt, if you have registered your ENS for 1 year and after 3 months decide to sell your RNS or transfer it to a new wallet then the remaining 9 months registration period carries over to the new wallet/owner.`
    },
    {
        title: `What tokens do I need to register an RNS?`,
        content: `RNS’s can be registered using ROOT or USDC. Transaction fees are paid in XRP.`
    },
    {
        title: `What wallet address can I register an RNS with?`,
        content: `You can register an RNS using either your FuturePass address or your EOA address.`
    },
    {
        title: `What is the price of an RNS?`,
        content: `RNS utilizes a tiered pricing model with registration fees listed in $USD. These fees are then converted into the 2 payment currencies USDC and ROOT. The conversion method uses pricing oracles that determine the amount of ROOT and USDC required at the time of registration relative to the $USD value of the RNS identity being registered.
        
        Pricing:
        
        5+ character identities per year - $10 USD paid in USDC or ROOT.
        
        4 character identities per year - $50 USD paid in USDC or ROOT.
        
        3 character identities per year - $150 USD paid in USDC or ROOT.
        
        2 character identities per year - $350 USD paid in USDC or ROOT.
        
        1 character identities per year - $750 USD paid in USDC or ROOT.`,
        highlights: [{
            text: "Pricing:",
            isUrl: false
        }],
    },
    {
        title: `Do I save on transaction fees by registering my RNS for a longer period of time?`,
        content: `Yes, regardless of the duration you choose to register your RNS for, the transaction fee remains the same. That means if you choose to renew your RNS every year over a period of 5 years, you will incur a total transaction fees that are five times higher than if you had registered it just once for the entire 5-year period.`
    },
    {
        title: `What is the registration process and how do we mitigate front-running?`,
        content: `The process of registering an RNS identity is designed to mitigate the risk of front-running through a three-step method involving a Reveal-Commitment Scheme. Front-running is a concern because if an RNS identity registration occurred in a single transaction, it would be vulnerable to interception; an observer could spot the registration in the transaction pool, submit a similar transaction with a higher gas fee, and thus secure the RNS identity first. To counter this, the registration process is as follows:
        
        Step 1. Request to Register: In the first step, a user creates a cryptographic hash combining a secret key (stored locally in the user's browser), their wallet address, and the desired RNS identity. This hash ensures the details of the intended registration remain confidential. Following this step, the user has one day to complete the final step of the process, but please keep in mind that while you have 1 day to complete Step 3, no reservation of the identity occurs during this period, and no registration fees are collected (only the gas fee for the “Request to Register” transaction is required). It's also noted that clearing the browser cache will erase the saved commit, necessitating a restart of the registration process.
        
        Step 2. Wait for 1 Minute: After the initial request, there's a compulsory one-minute waiting period. This acts as a buffer to prevent others from front-running the registration by submitting a higher gas fee transaction to claim the identity first.
        
        Step 3. Register: Finally, the user reveals their intention to register the RNS identity on-chain. The user will be asked to approve the spend of their ERC-20 payment token and then the registration transaction is made, the RNS identity is officially registered, and an ERC-1155 NFT representing the RNS identity is minted and transferred to the holder's wallet.
        
        The design of this process mitigates potential front-runners as they would be required to submit their own hashed secret, endure the one-minute waiting period, and then attempt to register the identity. However, they cannot circumvent the need for the original user's secret, making unauthorized registration via front-running infeasible.`,
        highlights: [
            {
                text: "Step 1.",
                isUrl: false
            },
            {
                text: "Step 2.",
                isUrl: false
            },
            {
                text: "Step 3.",
                isUrl: false
            },
        ],
    },
    {
        title: `How can I integrate RNS into my app?`,
        content: 'Integration docs can be found at https://www.docs.rootnameservice.com.',
        highlights: [{
            text: "https://www.docs.rootnameservice.com",
            isUrl: true
        }],
    },
    {
        title: `How can I contact you with a suggestion, feedback or issue?`,
        content: `The easiest and quickest method is via opening a Support Ticket in our discord.`
    },
]