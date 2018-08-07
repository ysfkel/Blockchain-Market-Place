
export const transformStore = ({storeResult, web3}) => {
    return {
        name:  web3.toAscii(storeResult[0]),
        description: web3.toAscii(storeResult[1]),
        storeId: storeResult[2].toNumber(),
        actIdx: storeResult[3].toNumber()
    }
}