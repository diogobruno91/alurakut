import { SiteClient } from 'datocms-client';

export default async function recebeResquest(request, response) {

    if (request.method === 'POST') {

        const _token = 'e85ceadcf6bada7e0d0f2b63a78a64'

        const client = new SiteClient(_token);
    
        const resgistroCreated = await client.items.create({
            itemType: "972687",
            ...request.body
        })
    
        response.json({
            'dados': 'Dados qualquer',
            'resgistroCreated': resgistroCreated
        })
        return;
    }

    response.status(404).json({
        message: 'Ainda não temos nada no GET, mas no POST tem!'
    })


}