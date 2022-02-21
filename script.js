const nearConfig = {
    networkId: 'testnet',
    nodeUrl: 'https://rpc.testnet.near.org',
    //contractName: CONTRACT_NAME,
    walletUrl: 'https://wallet.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org',
    explorerUrl: 'https://explorer.testnet.near.org',
}

let near;
let walletConnection;

document.getElementById("login").addEventListener("click",()=>login());
document.getElementById("logout").addEventListener("click",()=>logout());

async function init(){
    near = await nearApi.connect({ deps: { keyStore: new nearApi.keyStores.BrowserLocalStorageKeyStore()}, ...nearConfig});
    walletConnection = new nearApi.WalletConnection(near);
    await actualize();
}

async function login(){
    await walletConnection.requestSignIn();
    await actualize();
}

async function logout(){
    await walletConnection.signOut();
    await actualize();
}

async function actualize(){
    if(walletConnection.isSignedIn()){
        document.getElementById("login").style.display = "none";
        document.getElementById("logout").style.display = "block";
        const account = await near.account(walletConnection.getAccountId());
        const amount = (await account.state()).amount;
        document.getElementById("accountId").innerText = walletConnection.getAccountId();
        document.getElementById("amount").innerText = nearApi.utils.format.formatNearAmount(amount);
    }
    else{
        document.getElementById("login").style.display = "block";
        document.getElementById("logout").style.display = "none";
        document.getElementById("accountId").innerText = ""
        document.getElementById("amount").innerText = "";
    }
}
init()